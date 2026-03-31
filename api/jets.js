import { jets } from './_data.js'

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.json({ success: true, data: jets })
}