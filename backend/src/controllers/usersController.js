// src/controllers/userController.js
const User = require('../models').User;
const { presentUser } = require('../presenters/userPresenter');

const usersController = {
    /**
     * Create a new user.
     */
    createUser: async (req, res) => {
        try {
            const { username, email, password, role } = req.body;

            const newUser = await User.create({
                username,
                email,
                password,
                role
            });

            res.status(201).json(presentUser(newUser));
        } catch (error) {
            res.status(500).json({ message: error.message || 'Internal server error' });
        }
    },

    /**
     * List all users.
     */
    listAllUsers: async (req, res) => {
        try {
            const users = await User.findAll();
            const presentedUsers = users.map(user => presentUser(user));
            res.json(presentedUsers);
        } catch (error) {
            res.status(500).json({ message: error.message || 'Internal server error' });
        }
    },

    /**
     * Get details of a specific user.
     */
    getUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            res.json(presentUser(user));
        } catch (error) {
            res.status(500).json({ message: error.message || 'Internal server error' });
        }
    },

    /**
     * Update an existing user.
     */
    updateUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const { username, email, role, password } = req.body;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            user.username = username || user.username;
            user.email = email || user.email;
            user.role = role || user.role;
            user.password = password || user.password;

            await user.save();

            res.json(presentUser(user));
        } catch (error) {
            res.status(500).json({ message: error.message || 'Internal server error' });
        }
    },

    /**
     * Delete a user.
     */
    deleteUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            await user.destroy();

            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message || 'Internal server error' });
        }
    }
};

module.exports = usersController;
