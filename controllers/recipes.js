const express = require('express')
const router = express.Router()
const Ingredient = require('../models/ingredient')
const Recipe = require('../models/recipe')
const isSignedIn = require('../middleware/is-signed-in')

router.get('/', isSignedIn, async (req, res) => {
  const recipes = await Recipe.find({ owner: req.session.user._id }).populate(
    'ingredients'
  )
  res.render('recipes/index.ejs', { recipes })
})

router.get('/new', isSignedIn, async (req, res) => {
  const ingredients = await Ingredient.find()
  res.render('recipes/new.ejs', { ingredients })
})

router.post('/', isSignedIn, async (req, res) => {
  const { ingredients, ...recipeData } = req.body
  const ingredientsArray = Array.isArray(ingredients)
    ? ingredients
    : ingredients
    ? [ingredients]
    : []

  const newRecipe = new Recipe({
    ...recipeData,
    ingredients: ingredientsArray,
    owner: req.session.user._id
  })
  await newRecipe.save()
  res.redirect('/recipes')
})

router.get('/:id', isSignedIn, async (req, res) => {
  const recipe = await Recipe.findOne({
    _id: req.params.id,
    owner: req.session.user._id
  }).populate('ingredients')
  res.render('recipes/show.ejs', { recipe })
})

router.get('/:id/edit', isSignedIn, async (req, res) => {
  const recipe = await Recipe.findOne({
    _id: req.params.id,
    owner: req.session.user._id
  })
  const ingredients = await Ingredient.find()
  res.render('recipes/edit.ejs', { recipe, ingredients })
})

router.put('/:id', isSignedIn, async (req, res) => {
  const { ingredients, ...recipeData } = req.body
  const ingredientsArr = Array.isArray(ingredients)
    ? ingredients
    : ingredients
    ? [ingredients]
    : []
  const updateRecipe = await Recipe.findOneAndUpdate(
    { _id: req.params.id, owner: req.session.user._id },
    { ...recipeData, ingredients: ingredientsArr },
    { new: true }
  )
  res.redirect(`/recipes/${updateRecipe._id}`)
})

router.delete('/:id', isSignedIn, async (req, res) => {
  const deletedRecipe = await Recipe.findOneAndDelete({
    _id: req.params.id,
    owner: req.session.user._id
  })
  res.redirect('/recipes')
})

module.exports = router
