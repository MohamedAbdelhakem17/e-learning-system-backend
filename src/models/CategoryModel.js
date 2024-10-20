const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please insert a category name"],
            unique: [true, "Category name must be unique"],
            trim: true,
            minlength: [2, "Category name must be at least 2 characters long"],
            maxlength: [25, "Category name must be less than 25 characters long"],
        },

        slug: {
            type: String,
            lowercase: true,
        },

        imageCover: {
            type: String,
        },

    },
    { timestamps: true }
);


const setImageURL = (doc) => {
    if (doc.imageCover) {
        const imageUrl = `${process.env.WEPSIT_HOST}/categories/${doc.imageCover}`;
        doc.imageCover = imageUrl;
    }
};

categorySchema.post("init", (doc) => {
    setImageURL(doc);
});

categorySchema.post("save", (doc) => {
    setImageURL(doc);
});


module.exports = mongoose.model("Category", categorySchema);
