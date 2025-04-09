import express from "express";

const router = express.Router();

const products = [
    { id: 1, name: 'iPhone' },
    { id: 2, name: 'MacBook' }
];

// 列表
router.get('/', (req, res) => {
    res.json(products);
});

// 详情

router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send('商品未找到');
    res.json(product);
});

export default router;