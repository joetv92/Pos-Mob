import { Order } from '../types';

export const calculateTotalSales = (orders: Order[]): number => {
    return orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
};

export const getTopProducts = (orders: Order[]) => {
    const counts: Record<string, number> = {};

    orders.forEach((order) => {
        order.order_items.forEach((item) => {
            counts[item.product_name] = (counts[item.product_name] || 0) + item.quantity;
        });
    });

    return Object.entries(counts)
        .map(([name, qty]) => ({ name, qty }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5);
};