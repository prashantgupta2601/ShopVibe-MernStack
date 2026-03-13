const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = this.rating || 0;
    this.numReviews = 0;
  } else {
    const average =
      this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length;
    this.averageRating = average;
    this.rating = average;
    this.numReviews = this.reviews.length;
  }
};

// Ensure rating/averageRating stay in sync when the document is saved
productSchema.pre('save', function (next) {
  if (this.reviews.length === 0) {
    this.averageRating = this.rating || 0;
    this.numReviews = 0;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
