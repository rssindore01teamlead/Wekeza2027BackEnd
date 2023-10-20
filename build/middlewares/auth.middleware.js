"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const index_schema_1 = __importStar(require("../database/index.schema"));
const authMiddleware = async (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization'];
        if (bearerHeader) {
            console.log("chek");
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            console.log(bearerToken);
            const secret = process.env.JWT_SECRET;
            const verificationResponse = (await jsonwebtoken_1.default.verify(bearerToken, secret));
            const userId = verificationResponse.user_id;
            console.log('userId ' + userId);
            const findUser = await index_schema_1.default(index_schema_1.T.ER_SIGNUP).where('user_id', Number(userId)).first();
            console.log('findUser ' + JSON.stringify(findUser));
            if (findUser) {
                req.user = findUser;
                console.log('req.user' + JSON.stringify(req.user));
                next();
            }
            else {
                next(new HttpException_1.default(401, 'Wrong authentication token'));
            }
        }
    }
    catch (error) {
        next(new HttpException_1.default(401, 'Wrong authentication token'));
    }
};
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map