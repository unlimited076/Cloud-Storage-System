const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const { registerUser, loginUser, getProfile, updateUserProfile } = require('../controllers/authController');

const { expect } = chai;

describe('User Controller Tests', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });


    afterEach(() => {
        sandbox.restore();
    });

    describe('registerUser Function Test', () => {

        it('should create a new user successfully and return a token', async () => {
            
            const req = {
                body: { name: "John Doe", email: "john.doe@example.com", password: "password123" }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };
            const createdUser = { _id: new mongoose.Types.ObjectId(), id: 'someId', ...req.body };

            
            sandbox.stub(User, 'findOne').resolves(null);
            sandbox.stub(User, 'create').resolves(createdUser);
            
            sandbox.stub(jwt, 'sign').returns('fake_jwt_token');

            
            await registerUser(req, res);

        
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            
            expect(res.json.getCall(0).args[0]).to.have.property('token', 'fake_jwt_token');
        });

        it('should return 400 if user already exists', async () => {
            
            const req = {
                body: { name: "Jane Doe", email: "jane.doe@example.com", password: "password123" }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };
            sandbox.stub(User, 'findOne').resolves({ email: req.body.email });

            
            await registerUser(req, res);

            
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'User already exists' })).to.be.true;
        });

        it('should return 500 on a server error', async () => {
            
            const req = {
                body: { name: "Test User", email: "test@example.com", password: "password123" }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };
            sandbox.stub(User, 'findOne').throws(new Error('Database error'));

            
            await registerUser(req, res);

            
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Database error' })).to.be.true;
        });
    });

    
    describe('loginUser Function Test', () => {

        it('should login successfully with correct credentials', async () => {
            
            const req = {
                body: { email: "john.doe@example.com", password: "password123" }
            };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis()
            };
            const mockUser = {
                _id: new mongoose.Types.ObjectId(),
                id: 'someId',
                name: "John Doe",
                email: req.body.email,
                password: "hashedPassword"
            };

            sandbox.stub(User, 'findOne').resolves(mockUser);
            sandbox.stub(bcrypt, 'compare').resolves(true);
            sandbox.stub(jwt, 'sign').returns('fake_jwt_token');

            
            await loginUser(req, res);

            
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.getCall(0).args[0]).to.have.property('token', 'fake_jwt_token');
            expect(res.status.called).to.be.false;
        });

        it('should return 401 for invalid credentials', async () => {
            
            const req = {
                body: { email: "john.doe@example.com", password: "wrongpassword" }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };
            sandbox.stub(User, 'findOne').resolves(null);

            
            await loginUser(req, res);

            
            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ message: 'Invalid email or password' })).to.be.true;
        });
    });

    
    describe('getProfile Function Test', () => {

        it('should return user profile data for an authenticated user', async () => {
            
            const userId = new mongoose.Types.ObjectId();
            const req = { user: { id: userId } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };
            const mockProfile = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                university: 'Test University',
                address: '123 Test St'
            };
            sandbox.stub(User, 'findById').resolves(mockProfile);

            
            await getProfile(req, res);

            
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(mockProfile)).to.be.true;
        });

        it('should return 404 if user is not found', async () => {
            
            const req = { user: { id: new mongoose.Types.ObjectId() } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };
            sandbox.stub(User, 'findById').resolves(null);

            
            await getProfile(req, res);

            
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: 'User not found' })).to.be.true;
        });
    });

    
    describe('updateUserProfile Function Test', () => {

        it('should update the user profile successfully', async () => {
            
            const userId = new mongoose.Types.ObjectId();
            const req = {
                user: { id: userId },
                body: { name: "Johnathan Doe", university: "New University" }
            };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis()
            };
            const mockUser = {
                _id: userId,
                name: 'John Doe',
                email: 'john.doe@example.com',
                university: 'Old University',
                address: 'Old Address',
                save: sinon.stub().resolvesThis()
            };
            sandbox.stub(User, 'findById').resolves(mockUser);
            sandbox.stub(jwt, 'sign').returns('fake_jwt_token');

            
            await updateUserProfile(req, res);

            
            expect(mockUser.save.calledOnce).to.be.true;
            expect(mockUser.name).to.equal(req.body.name);
            expect(mockUser.university).to.equal(req.body.university);
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.getCall(0).args[0]).to.have.property('token', 'fake_jwt_token');
        });

        it('should return 404 if user to update is not found', async () => {
            
            const req = {
                user: { id: new mongoose.Types.ObjectId() },
                body: { name: "Ghost User" }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };
            sandbox.stub(User, 'findById').resolves(null);

            
            await updateUserProfile(req, res);

            
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: 'User not found' })).to.be.true;
        });
    });
});