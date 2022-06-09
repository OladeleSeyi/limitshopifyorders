import { Session } from "@shopify/shopify-api/dist/auth/session";
import SessionDB from "../../database/models/sessionModel";
import UserDB from "../../database/models/userModel";

export const storeCallback = async function storeCallback(session: Session) {
  try {
    await SessionDB.findOneAndUpdate(
      { id: session.id },
      {
        $set: {
          id: session.id,
          shop: session.shop,
          payload: { ...session },
        },
      },
      { upsert: true }
    );

    return true;
  } catch (err) {
    throw err;
  }
};

export const loadCallback = async (id: string) => {
  try {
    const res = await SessionDB.findOne({ id: id });
    if (!res) {
      return undefined;
    }

    const session = new Session(res.id);
    const {
      shop,
      state,
      scope,
      accessToken,
      isOnline,
      expires,
      onlineAccessInfo,
    } = res.payload;

    session.shop = shop;
    session.state = state;
    session.scope = scope;
    session.accessToken = accessToken;
    session.isOnline = isOnline;
    session.expires = expires;
    session.onlineAccessInfo = onlineAccessInfo;
    return session;
  } catch (error) {
    throw error;
  }
};

export const deleteCallback = async function deleteCallback(id) {
  try {
    await SessionDB.deleteOne({ id: id });
    return true;
  } catch (error) {
    throw error;
  }
};

export const createUser = async function addUser({ shop, scope, name, info }) {
  try {
    await UserDB.findOneAndUpdate(
      { shop: shop },
      {
        $set: {
          shop,
          scope,
          name,
          user_info: info,
          uninstalled: true,
          deleted: false,
          updated_at: Date.now(),
        },
      },
      { upsert: true }
    );
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async function deleteUser(shop) {
  try {
    await UserDB.deleteOne({ shop: shop });
  } catch (error) {
    throw error;
  }
};

export const updateUser = async function updateUser(shop, data) {
  try {
    const obj = {
      uninstalled: data.uninstalled,
      theme_status: data.preferredThemeMode,
      deleted: data.deleted,
      updated_at: Date.now(),
    };
    await UserDB.findOneAndUpdate({ shop: shop }, obj);
  } catch (error) {
    throw error;
  }
};

export const getUserAccessToken = async function findToken(shop) {
  try {
    const res = await SessionDB.findOne({
      shop: shop,
    })

    if (res?.payload?.accessToken) {
      return res.payload.accessToken;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const removeSession = async function removeSession(shop) {
  try {
    await SessionDB.deleteOne({ shop: shop });
  } catch (error) {
    throw error;
  }
};
