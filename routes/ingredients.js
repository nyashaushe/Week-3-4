const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('./auth');
const ingredientsController = require('../controllers/ingredientsController');

/**
 * @swagger
 * /api/ingredients:
 *   get:
 *     summary: Get all ingredients
 *     tags: [Ingredients]
 *     security:
 *       - githubAuth: []
 *     responses:
 *       200:
 *         description: List of all ingredients
 *       500:
 *         description: Server error
 */
router.get('/', ensureAuthenticated, ingredientsController.getAllIngredients);

/**
 * @swagger
 * /api/ingredients/{id}:
 *   get:
 *     summary: Get an ingredient by ID
 *     tags: [Ingredients]
 *     security:
 *       - githubAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ingredient details
 *       404:
 *         description: Ingredient not found
 *       500:
 *         description: Server error
 */
router.get('/:id', ensureAuthenticated, ingredientsController.getIngredientById);

/**
 * @swagger
 * /api/ingredients:
 *   post:
 *     summary: Create a new ingredient
 *     tags: [Ingredients]
 *     security:
 *       - githubAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - nutritionalValue
 *               - shelfLife
 *               - storageInstructions
 *     responses:
 *       201:
 *         description: Ingredient created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post('/', ensureAuthenticated, ingredientsController.createIngredient);

/**
 * @swagger
 * /api/ingredients/{id}:
 *   put:
 *     summary: Update an ingredient
 *     tags: [Ingredients]
 *     security:
 *       - githubAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Ingredient updated successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Ingredient not found
 *       500:
 *         description: Server error
 */
router.put('/:id', ensureAuthenticated, ingredientsController.updateIngredient);

/**
 * @swagger
 * /api/ingredients/{id}:
 *   delete:
 *     summary: Delete an ingredient
 *     tags: [Ingredients]
 *     security:
 *       - githubAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ingredient deleted successfully
 *       404:
 *         description: Ingredient not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', ensureAuthenticated, ingredientsController.deleteIngredient);

module.exports = router;
