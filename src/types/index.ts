export interface OrderItem {
    id: string;
    order_id: string;
    product_name: string;
    quantity: number;
    price: number;
}

export interface User {
    id: string;
    name: string;
    role: string;
}

export interface Order {
    id: string;
    total_amount: number;
    created_at_local: string;
    user?: User;
    order_items: OrderItem[];
}

export interface Session {
    id: string;
    status: 'open' | 'closed';
    start_time: string;
    end_time?: string;
}

export interface DashboardResponse {
    session: Session | null;
    orders: Order[];
}