import { Types } from "mongoose";

const getId = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Types.ObjectId) {
    return value.toString();
  }

  if (value && typeof value === "object" && "_id" in value) {
    return getId((value as { _id: unknown })._id);
  }

  return "";
};

export const serializeCity = (city: any) => ({
  id: getId(city._id),
  name: city.name,
  free_usd: city.free_usd,
  fee_lbp: city.fee_lbp,
  status: city.status,
});

export const serializeDistrict = (district: any) => ({
  id: getId(district._id),
  name: district.name,
  city: {
    id: getId(district.city),
    name: district.city?.name ?? "",
  },
  status: district.status,
});

export const serializeUser = (user: any) => ({
  id: getId(user._id),
  username: user.username,
  email: user.email,
  name: user.name,
  phone: user.phone,
  district: {
    id: getId(user.district),
    name: user.district?.name ?? "",
    city: {
      id: getId(user.district?.city),
      name: user.district?.city?.name ?? "",
    },
  },
  status: user.status,
  type: user.type,
});

export const serializeOrder = (order: any) => ({
  id: getId(order._id),
  number: order.number,
  resource: {
    id: getId(order.resource),
    name: order.resource?.name ?? "",
  },
  client_phone: order.client_phone,
  client_name: order.client_name,
  district: {
    id: getId(order.district),
    name: order.district?.name ?? "",
    city: {
      id: getId(order.district?.city),
      name: order.district?.city?.name ?? "",
    },
  },
  added_by: {
    id: getId(order.added_by),
    name: order.added_by?.name ?? "",
  },
  price_usd: order.price_usd,
  price_lbp: order.price_lbp,
  fee_usd: order.fee_usd,
  fee_lbp: order.fee_lbp,
  cash_payed: order.cash_payed,
});

export const serializeTrip = (trip: any) => ({
  id: getId(trip._id),
  title: trip.title,
  city: {
    id: getId(trip.city),
    name: trip.city?.name ?? "",
  },
  driver: {
    id: getId(trip.driver),
    name: trip.driver?.name ?? "",
  },
  exchange_usd: trip.exchange_usd,
  exchange_lbp: trip.exchange_lbp,
  status: trip.status,
  delivered_at: trip.delivered_at,
  order_count: trip.order_count ?? 0,
});

export const serializeTripOrder = (tripOrder: any) => ({
  id: getId(tripOrder._id),
  trip_id: getId(tripOrder.trip),
  order: serializeOrder(tripOrder.order),
  status: tripOrder.status,
  index: tripOrder.index,
  fee_applied: tripOrder.fee_applied !== false,
  note: tripOrder.note ?? "",
});

export const serializeExpenseCategory = (category: any) => ({
  id: getId(category._id),
  name: category.name,
});

export const serializeExpenseEntry = (entry: any) => ({
  id: getId(entry._id),
  expense_category: {
    id: getId(entry.expense_category),
    name: entry.expense_category?.name ?? "",
  },
  amount_usd: entry.amount_usd,
  amount_lbp: entry.amount_lbp,
  trip: entry.trip
    ? {
      id: getId(entry.trip),
      title: entry.trip?.title ?? "",
    }
    : null,
  created_at: entry.createdAt,
});

export const serializeDailyBox = (dailyBox: any) => ({
  id: getId(dailyBox._id),
  opening_amount_usd: dailyBox.opening_amount_usd,
  opening_amount_lbp: dailyBox.opening_amount_lbp,
  closing_amount_usd: dailyBox.closing_amount_usd,
  closing_amount_lbp: dailyBox.closing_amount_lbp,
  closed_at: dailyBox.closed_at,
  user: {
    id: getId(dailyBox.user),
    name: dailyBox.user?.name ?? "",
  },
  created_at: dailyBox.createdAt,
});
