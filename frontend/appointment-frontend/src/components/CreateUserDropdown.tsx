import React, { useState, useRef, useEffect } from "react";
import { Privilege } from "@/types/superTypes";
import { PlusIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface CreateUserDropdownProps {
    onSelect: (privilege: Privilege) => void;
}

const options: {privilege: Privilege; label: string }[] = [
    { privilege: "Doctor", label: "Create Doctor" },
    { privilege: "Admin", label: "Create Admin" },
    { privilege: "Super", label: "Create Super" }
];

export const CreateUserDropdown: React.FC<CreateUserDropdownProps> = ({ onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (privilege: Privilege) => {
        onSelect(privilege);
        setIsOpen(false);
    };
    
    return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        <PlusIcon className="h-4 w-4" />
        Create User
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {options.map(({ privilege, label }) => (
              <button
                key={privilege}
                onClick={() => handleSelect(privilege)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};