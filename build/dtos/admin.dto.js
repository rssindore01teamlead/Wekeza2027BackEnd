"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordDto = exports.AlpacaUserDto = exports.storeAlpacaDto = void 0;
const class_validator_1 = require("class-validator");
class storeAlpacaDto {
}
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], storeAlpacaDto.prototype, "user_id", void 0);
__decorate([
    class_validator_1.IsString({ groups: ['create'] }),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], storeAlpacaDto.prototype, "al_id", void 0);
__decorate([
    class_validator_1.IsString({ groups: ['create'] }),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], storeAlpacaDto.prototype, "al_account_number", void 0);
__decorate([
    class_validator_1.IsString({ groups: ['create'] }),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], storeAlpacaDto.prototype, "al_status", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], storeAlpacaDto.prototype, "al_crypto_status", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], storeAlpacaDto.prototype, "al_currency", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], storeAlpacaDto.prototype, "al_last_equity", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], storeAlpacaDto.prototype, "al_created_at", void 0);
exports.storeAlpacaDto = storeAlpacaDto;
class AlpacaUserDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], AlpacaUserDto.prototype, "user_id", void 0);
exports.AlpacaUserDto = AlpacaUserDto;
class ChangePasswordDto {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "user_id", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "password", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newpassword", void 0);
exports.ChangePasswordDto = ChangePasswordDto;
//# sourceMappingURL=admin.dto.js.map