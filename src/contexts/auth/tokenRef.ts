import { createRef } from "react";

import { User } from "@/types";

// Create a ref to hold the auth token, which can be used in other parts of the app
// without needing to pass it down through props.
export const authTokenRef = createRef<User["token"]>();
