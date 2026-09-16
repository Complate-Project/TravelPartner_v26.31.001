import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { CustomCursor } from "./components/CustomCursor";
import { AuthProvider } from "./context/AuthContext";
import { MembershipProvider } from "./context/MembershipContext";
import { NotificationProvider } from "./context/NotificationContext";
import { CallProvider } from "./features/call/context/CallContext.tsx";

export default function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <MembershipProvider>
                    <CallProvider>
                        <CustomCursor />
                        <RouterProvider router={router} />
                    </CallProvider>
                </MembershipProvider>
            </NotificationProvider>
        </AuthProvider>
    );
}
