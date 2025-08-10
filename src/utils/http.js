export const ok = (res, data) => res.json(data);
export const created = (res, data) => res.status(201).json(data);
export const badRequest = (res, msg) => res.status(400).json({ error: msg });
export const serverError = (res, e) => res.status(500).json({ error: e.message });
