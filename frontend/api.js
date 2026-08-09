import { supabase } from "./lib/supabase";

// =====================================================
// SUPABASE API HELPER
// =====================================================

const api = {
    supabase,

    // GET
    async get(table, options = {}) {
        let query = supabase
            .from(table)
            .select(options.select || "*");

        if (options.order) {
            query = query.order(
                options.order.column,
                {
                    ascending:
                        options.order.ascending ?? false,
                }
            );
        }

        if (options.limit) {
            query = query.limit(options.limit);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        return {
            data: data || [],
        };
    },

    // POST
    async post(table, payload) {
        const { data, error } = await supabase
            .from(table)
            .insert(payload)
            .select();

        if (error) {
            throw error;
        }

        return {
            data: data || [],
        };
    },

    // PUT / UPDATE
    async put(table, id, payload) {
        const { data, error } = await supabase
            .from(table)
            .update(payload)
            .eq("id", id)
            .select();

        if (error) {
            throw error;
        }

        return {
            data: data || [],
        };
    },

    // DELETE
    async delete(table, id) {
        const { data, error } = await supabase
            .from(table)
            .delete()
            .eq("id", id)
            .select();

        if (error) {
            throw error;
        }

        return {
            data: data || [],
        };
    },
};

export default api;