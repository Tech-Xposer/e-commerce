const Product = require('../model/productModel');

const listProduct = async (req, res) => {
    try {
        const result = await Product.find();
        return res.status(200).json(result);

    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ error: error.message });
    }
};

const getProductByID = async (req, res) => {
    try {
        const ID = req.params.id;
        if (!ID) {
            return res.status(400).json({ msg: 'All fields are requried!' })
        }
        const result = await Product.findById(ID);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        res.status(500).json({ error: error.message });
    }
};

const addProduct = async (req, res) => {
    try {
        const body = req.body[1];

        if (!body.model ||
            !body.name ||
            !body.type ||
            !body.price ||
            !body.availability ||
            !body.image) return res.status(400).json({ msg: "All fields required" })

        const result = await Product.create(body)
        return res.status(201).json(result);
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: error.message });
    }
};

const deleteProductByID = async (req, res) => {
    try {
        const ID = req.params.id;
        if (!ID) return res.status(400).json({ msg: "Id Required!" })
        const result = await Product.findByIdAndDelete(ID);
        if (!result) return res.status(400).json({ msg: 'No Product Found' })
        return res.status(200).json({ msg: result });

    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ error: error.message });
    }
};

const deleteProducts = async (req, res) => {
    try {
        const IDs = req.body;
        console.log(`All Product Ids: ${IDs}`);
        res.status(200).send(`All Product Ids: ${IDs}`);
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: error.message });
    }
}

const updateProduct = async (req, res) => {
    try {
        const body = req.body;
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ msg: "Please provide id of product" })
        }

        const result = await Product.findByIdAndUpdate({ _id: id }, body)
        if (!result) return res.status(400).json({ msg: 'No Product Found' })
        console.log(`Result: ${result}`);
        res.status(200).json({ result: result })
    } catch (error) {
        console.log(`Error while update product: ${error}`)
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { listProduct, getProductByID, addProduct, deleteProductByID, deleteProducts, updateProduct };
