import { creativaApi } from "@/utils/creativa/api.server";
import { evaluateQuote, parseQuoteBody } from "@/utils/creativa/quote.server";

export const config = { api: { bodyParser: false } };
export default creativaApi("POST", "quote", async (_req, body) => (await evaluateQuote(parseQuoteBody(body))).quote);
