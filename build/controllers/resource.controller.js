"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_service_1 = __importDefault(require("../services/users.service"));
const util_1 = require("../utils/util");
class ResourceController {
    constructor() {
        this.userService = new users_service_1.default();
        this.images = async (req, res, next) => {
            try {
                const imagepath = req['files'];
                res.status(201).json({ imagepath: imagepath, message: 'success' });
            }
            catch (error) {
                next(error);
            }
        };
        this.getImage = async (req, res, next) => {
            try {
                const key = req.params.key;
                const readStream = await util_1.getFromAws1(key);
                readStream.pipe(res);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = ResourceController;
//# sourceMappingURL=resource.controller.js.map