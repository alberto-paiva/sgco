import axios from "axios";

// Define an interface for the response from the ipify API
interface IPAddressResponse {
  ip: string;
}

interface GetUserIPProps {
  format?: "text" | "json" | "jsonp" | "getip";
  protocol?: "ipv4" | "ipv6";
  callback?: string;
}

// Function to get the user's public IP address
export async function getUserIP(
  props?: GetUserIPProps,
): Promise<string | IPAddressResponse> {
  try {
    const ipifyIpv4URL = "https://api.ipify.org";
    const ipifyIpv64URL = "https://api64.ipify.org";

    // Set the request format and callback if specified
    const params: Record<string, string> = {};

    // If the format is specified, add it to the parameters
    if (props?.format) {
      params.format = props?.format;
    }

    // If a callback is specified for JSONP, add it to the parameters
    if (props?.callback && props?.format === "jsonp") {
      params.callback = props?.callback;
    }

    if (props?.format === "getip") {
      params.format = "jsonp";
      params.callback = "getip";
    }

    const url = props?.protocol === "ipv6" ? ipifyIpv64URL : ipifyIpv4URL;

    const response = await axios.get<IPAddressResponse>(url, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Usage examples
export const testeGetIP = async () => {
  try {
    const plainTextIP = await getUserIP({ protocol: "ipv6" });
    console.log("Plain Text IP (IPV6:", plainTextIP);

    const jsonIP = await getUserIP({ format: "json" });
    console.log("JSON IP:", jsonIP);

    const jsonpIP = await getUserIP({
      format: "jsonp",
      protocol: "ipv4",
    });
    console.log("JSONP IP:", jsonpIP);

    const jsonpIPCustomCallback = await getUserIP({
      format: "jsonp",
      protocol: "ipv4",
      callback: "myCallBack",
    });
    console.log("JSONP IP Custom Callback:", jsonpIPCustomCallback);

    const jsonpGet = await getUserIP({ format: "getip" });
    console.log("JSONP GETIP:", jsonpGet);
  } catch (error) {
    console.error("Error:", error);
  }
};
