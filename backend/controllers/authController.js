import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, phone, address } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error('Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone: phone || '',
        address: address || ''
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            pets: user.pets,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/update
// @access  Private
export const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete user
// @route   DELETE /api/auth/delete
// @access  Private
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

// @desc    Get user by ID (Admin only)
// @route   GET /api/auth/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user (Admin only)
// @route   PUT /api/auth/users/:id
// @access  Private/Admin
export const updateUserByAdmin = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;
        user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
            isAdmin: updatedUser.isAdmin
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
export const deleteUserByAdmin = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Create user (Admin only)
// @route   POST /api/auth/users
// @access  Private/Admin
export const createUserByAdmin = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, phone, address, isAdmin } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error('Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone: phone || '',
        address: address || '',
        isAdmin: isAdmin || false
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Add pet to user
// @route   POST /api/auth/pets
// @access  Private
export const addPet = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const { name, type, breed, age } = req.body;

        if (!name || !type) {
            res.status(400);
            throw new Error('Pet name and type are required');
        }

        user.pets.push({
            name,
            type,
            breed: breed || '',
            age: age || 0
        });

        await user.save();

        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            pets: user.pets,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update pet
// @route   PUT /api/auth/pets/:petId
// @access  Private
export const updatePet = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const pet = user.pets.id(req.params.petId);

        if (!pet) {
            res.status(404);
            throw new Error('Pet not found');
        }

        const { name, type, breed, age } = req.body;

        if (name) pet.name = name;
        if (type) pet.type = type;
        if (breed !== undefined) pet.breed = breed;
        if (age !== undefined) pet.age = age;

        await user.save();

        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            pets: user.pets,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete pet
// @route   DELETE /api/auth/pets/:petId
// @access  Private
export const deletePet = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const petId = req.params.petId;
        const petIndex = user.pets.findIndex(pet => pet._id.toString() === petId);

        if (petIndex === -1) {
            res.status(404);
            throw new Error('Pet not found');
        }

        user.pets.splice(petIndex, 1);
        await user.save();

        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            pets: user.pets,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};