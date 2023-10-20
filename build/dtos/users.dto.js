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
exports.ChangePasswordDto = exports.contactUsDto = exports.resetPasswordDto = exports.storeTrendingDto = exports.laneDto = exports.mailDto = exports.loginUserDto = exports.UpdateUserDto = exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
class CreateUserDto {
}
__decorate([
    class_validator_1.IsString({ groups: ['update', 'create'] }),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "fname", void 0);
__decorate([
    class_validator_1.IsString({ groups: ['update', 'create'] }),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "lname", void 0);
__decorate([
    class_validator_1.IsString({ groups: ['create'] }),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
exports.CreateUserDto = CreateUserDto;
class UpdateUserDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "user_id", void 0);
exports.UpdateUserDto = UpdateUserDto;
class loginUserDto {
}
__decorate([
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], loginUserDto.prototype, "email", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], loginUserDto.prototype, "password", void 0);
exports.loginUserDto = loginUserDto;
class mailDto {
}
__decorate([
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], mailDto.prototype, "id", void 0);
__decorate([
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], mailDto.prototype, "toemail", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], mailDto.prototype, "message", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], mailDto.prototype, "subject", void 0);
exports.mailDto = mailDto;
class laneDto {
}
__decorate([
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], laneDto.prototype, "user_id", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], laneDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], laneDto.prototype, "location", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], laneDto.prototype, "media", void 0);
exports.laneDto = laneDto;
class storeTrendingDto {
}
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], storeTrendingDto.prototype, "id", void 0);
__decorate([
    class_validator_1.IsString({ groups: ['create'] }),
    __metadata("design:type", String)
], storeTrendingDto.prototype, "symbol", void 0);
__decorate([
    class_validator_1.IsString({ groups: ['create'] }),
    __metadata("design:type", String)
], storeTrendingDto.prototype, "stock_name", void 0);
__decorate([
    class_validator_1.IsString({ groups: ['create'] }),
    __metadata("design:type", Date)
], storeTrendingDto.prototype, "created_at", void 0);
exports.storeTrendingDto = storeTrendingDto;
class resetPasswordDto {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], resetPasswordDto.prototype, "user_id", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], resetPasswordDto.prototype, "password", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], resetPasswordDto.prototype, "token_id", void 0);
exports.resetPasswordDto = resetPasswordDto;
class contactUsDto {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], contactUsDto.prototype, "fullname", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], contactUsDto.prototype, "company_name", void 0);
__decorate([
    class_validator_1.IsEmail(),
    __metadata("design:type", Object)
], contactUsDto.prototype, "email", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], contactUsDto.prototype, "phone", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], contactUsDto.prototype, "message", void 0);
exports.contactUsDto = contactUsDto;
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
//# sourceMappingURL=users.dto.js.map