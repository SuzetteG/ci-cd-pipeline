import "@testing-library/jest-dom";

// Polyfill for TextEncoder/TextDecoder (needed for react-router-dom in Node)
import { TextEncoder, TextDecoder } from "util";
if (typeof global.TextEncoder === "undefined") {
	global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
	global.TextDecoder = TextDecoder;
}
