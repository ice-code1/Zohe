import { useClerk } from "@clerk/clerk-react";

const { signOut } = useClerk();

function logOutUser() {
  signOut();
}