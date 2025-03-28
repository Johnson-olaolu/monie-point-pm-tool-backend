/* eslint-disable */
export default async () => {
    const t = {};
    return { "@nestjs/swagger": { "models": [[import("./user/dto/create-user.dto"), { "CreateUserDto": {} }], [import("./user/dto/update-user.dto"), { "UpdateUserDto": {} }], [import("./user/role/dto/create-role.dto"), { "CreateRoleDto": { name: { required: true, type: () => String }, description: { required: true, type: () => String } } }], [import("./user/role/dto/update-role.dto"), { "UpdateRoleDto": {} }]], "controllers": [[import("./app.controller"), { "AppController": { "getHello": { type: String } } }], [import("./user/user.controller"), { "UserController": { "create": { type: String }, "findAll": { type: String }, "findOne": { type: String }, "update": { type: String }, "remove": { type: String } } }], [import("./user/role/role.controller"), { "RoleController": { "create": {}, "findAll": {}, "findByName": {}, "findOne": {}, "update": {}, "remove": {} } }]] } };
};