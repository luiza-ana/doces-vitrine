import { api } from './api';

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
    register: async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
    },
    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
    listTestimonials: async () => {
        try {
            const response = await api.get('/testimonials');
            return response.data;
        } catch (e) {
            // Fallback para localStorage se a API não suportar
            const local = localStorage.getItem('@DocesVitrine:testimonials');
            return local ? JSON.parse(local) : [];
        }
    },
    createTestimonial: async (data) => {
        try {
            const response = await api.post('/testimonials', data);
            return response.data;
        } catch (e) {
            // Fallback para localStorage
            const local = localStorage.getItem('@DocesVitrine:testimonials');
            const testimonials = local ? JSON.parse(local) : [];
            const newT = { ...data, id: Date.now() };
            testimonials.push(newT);
            localStorage.setItem('@DocesVitrine:testimonials', JSON.stringify(testimonials));
            return newT;
        }
    },
    deleteTestimonial: async (id) => {
        try {
            await api.delete(`/testimonials/${id}`, {
                data: { testimonial_id: id }
            });
        } catch (e) {
            // Fallback para localStorage
            const local = localStorage.getItem('@DocesVitrine:testimonials');
            if (local) {
                const testimonials = JSON.parse(local).filter(t => (t.id || t._id) !== id);
                localStorage.setItem('@DocesVitrine:testimonials', JSON.stringify(testimonials));
            }
            // Lança o erro apenas se não for sucesso no fallback ou se a API falhar de forma crítica
            if (!local) throw e;
        }
    }
};

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
export const productService = {
    list: async () => {
        const response = await api.get('/products');
        return response.data;
    },
    create: async (productData) => {
        console.log('[productService.create] payload →', productData);
        const response = await api.post('/products', productData);
        return response.data;
    },
    update: async (productId, productData) => {
        const response = await api.put(`/products/${productId}`, productData);
        return response.data;
    },
    delete: async (productId) => {
        // A API espera { product_id } no body do DELETE
        const response = await api.delete(`/products/${productId}`, {
            data: { product_id: productId },
        });
        return response.data;
    },
};

// ─── FILES ───────────────────────────────────────────────────────────────────
export const fileService = {
    upload: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/files', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log('[fileService.upload] resposta →', response.data);
        return response.data;
    },
};