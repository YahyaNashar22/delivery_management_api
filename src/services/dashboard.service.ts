import { ActiveStatus } from "../enums/active-status.enum.js";
import { TripStatus } from "../enums/trip-status.enum.js";
import { CityModel } from "../models/city.model.js";
import { OrderModel } from "../models/order.model.js";
import { TripModel } from "../models/trip.model.js";
import { UserModel } from "../models/user.model.js";
import { UserTypes } from "../enums/user-type.enum.js";

export class DashboardService {
  public async getSummary() {
    const [
      totalOrders,
      activeTrips,
      revenue,
      activeDrivers,
      pendingOrders,
      citiesServed,
    ] = await Promise.all([
      OrderModel.countDocuments(),
      TripModel.countDocuments({
        status: { $in: [TripStatus.PENDING, TripStatus.IN_PROGRESS] },
      }),
      OrderModel.aggregate<{ total: number }>([
        { $group: { _id: null, total: { $sum: "$price_usd" } } },
      ]),
      UserModel.countDocuments({ type: UserTypes.DRIVER, status: ActiveStatus.ACTIVE }),
      TripModel.countDocuments({ status: TripStatus.PENDING }),
      CityModel.countDocuments({ status: ActiveStatus.ACTIVE }),
    ]);

    return {
      totalOrders,
      activeTrips,
      totalRevenue: revenue[0]?.total ?? 0,
      activeDrivers,
      pendingOrders,
      citiesServed,
    };
  }
}
