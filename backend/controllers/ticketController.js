const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')
const Ticket = require('../models/ticketModel')

const createTicket = asyncHandler(async (req, res) => {
  const { product, description } = req.body

  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(401).json({ message: 'User not found' })
  }

  if (!product || !description) {
    res.status(400).json({ message: 'Enter all fields' })
  }

  const ticket = await Ticket.create({
    user: req.user.id,
    product,
    description,
    status: 'new',
  })

  if (ticket) {
    res.status(201).json({
      _id: ticket._id,
      product: ticket.product,
      description: ticket.description,
      status: ticket.status,
      user: ticket.user,
    })
  } else {
    res.status(400).json({ message: 'Something went wrong' })
  }
})

const getTickets = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(401).json({ message: 'User not found' })
  }

  const tickets = await Ticket.find({ user: req.user.id })
})

const getTicket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(401).json({ message: 'User not found' })
  }

  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404).json({ message: 'Ticket not found' })
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401).json({ message: 'Not authorized' })
  }

  res.status(200).json(ticket)
})

const deleteTicket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(401).json({ message: 'User not found' })
  }

  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404).json({ message: 'Ticket not found' })
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401).json({ message: 'Not authorized' })
  }

  await ticket.remove()

  res.status(200).json({ success: true })
})

const updateTicket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(401).json({ message: 'User not found' })
  }

  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404).json({ message: 'Ticket not found' })
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401).json({ message: 'Not authorized' })
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )

  res.status(200).json(updatedTicket)
})

module.exports = {
  createTicket,
  getTickets,
  getTicket,
  deleteTicket,
  updateTicket,
}
