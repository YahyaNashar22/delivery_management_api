import { ActiveStatus } from "../enums/active-status.enum.js";
import { UserTypes } from "../enums/user-type.enum.js";
import { UserService } from "../services/user.service.js";
import { HttpError } from "../utils/http-error.js";
import { serializeUser } from "../utils/serializers.js";
import { assertEnumValue, assertRequiredString } from "../utils/validators.js";
const userService = new UserService();
export class UserController {
    async list(req, res) {
        const search = typeof req.query.search === "string" ? req.query.search : undefined;
        const type = typeof req.query.type === "string" && req.query.type !== "all"
            ? assertEnumValue(req.query.type, Object.values(UserTypes), "type")
            : undefined;
        const users = await userService.list({ search, type });
        res.json(users.map(serializeUser));
    }
    async create(req, res) {
        const user = await userService.create({
            username: assertRequiredString(req.body.username, "username"),
            email: assertRequiredString(req.body.email, "email"),
            password: assertRequiredString(req.body.password ?? "changeme123", "password"),
            name: assertRequiredString(req.body.name, "name"),
            phone: assertRequiredString(req.body.phone, "phone"),
            district: assertRequiredString(req.body.district, "district"),
            type: assertEnumValue(req.body.type, Object.values(UserTypes), "type"),
        });
        const populated = await user.populate({ path: "district", select: "name city", populate: { path: "city", select: "name" } });
        res.status(201).json(serializeUser(populated));
    }
    async updateStatus(req, res) {
        const status = assertEnumValue(req.body.status, Object.values(ActiveStatus), "status");
        const user = await userService.updateStatus(String(req.params.id), status);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        res.json(serializeUser(user));
    }
}
