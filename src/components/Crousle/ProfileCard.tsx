import React from "react";

interface ProfileCardProps {
  image: string;
  name: string;
  onClick?: () => void;
}

export default function ProfileCard({
  image,
  name,
  onClick,
}: ProfileCardProps) {
 return (
    <div
      onClick={onClick}
      className="cursor-pointer text-center"
    >
      {/* Image */}
      <div className="w-full h-56 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
}
