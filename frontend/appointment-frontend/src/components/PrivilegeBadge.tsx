import React from "react";
import { Privilege } from "@/types/superTypes";

interface PrivilegeBadgeProps {
    privilege: Privilege;
}

const privilegeStyles: Record<Privilege, string> = {
    Doctor: 'bg-blue-100 text-blue-800',
    Admin: 'bg-amber-100 text-amber-800',
    Super: 'bg-purple-100 text-purple-800'
};

const privilegeLabels: Record<Privilege, string> = {
    Doctor: "Doctor",
    Admin: "Admin",
    Super: "Super"
};

export const PrivilegeBadge: React.FC<PrivilegeBadgeProps> = ({privilege}) => {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${privilegeStyles[privilege]}`}
        >
            {privilegeLabels[privilege]}
        </span>
    );
};