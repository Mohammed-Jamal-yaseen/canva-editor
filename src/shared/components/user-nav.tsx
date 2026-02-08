"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/shared/components/ui/dropdown-menu";
import { Loader2, LogOut, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";

export const UserButton = () => {
  const { theme, setTheme } = useTheme();
  const { data: session, loading } = {
    data:{
        user:{
            name:'mohammed yaseen',
            email:'m@gmail.com',
            image:'./placeholder.'
        }
        
    },
    loading:false
  }
//   authClient.useSession();

  const onSignOut = async () => {
    alert('not applyed yet ')
    // await authClient.signOut({
    //   fetchOptions: {
    //     onSuccess: () => {
    //       router.push("/auth/sign-in");
    //     }
    //   }
    // });
  };

  if (loading) {
    return <Loader2 className="size-4 animate-spin text-muted-foreground" />;
  }

  if (!session) {
    return null;
  }

  const user = session.user;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition">
          <AvatarImage src={user.image || "./placeholder"} alt={user.name} />
          <AvatarFallback className="bg-primary text-white font-bold">
            {user.name?.[0] || <User className="size-4" />}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 bg-white dark:bg-[#18191b] border-gray-200 dark:border-slate-800">
        <div className="flex items-center gap-x-2 p-2 text-right">
            <Avatar className="size-8">
                <AvatarImage src={user.image || ""} alt={user.name} />
                <AvatarFallback className="bg-primary dark:bg-white text-white dark:text-black text-xs">
                    {user.name?.[0]}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
        </div>
        <DropdownMenuSeparator className="dark:bg-slate-800" />
        <DropdownMenuItem 
            className="h-10 cursor-pointer text-slate-700 dark:text-slate-200 focus:bg-slate-100 dark:focus:bg-slate-800"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            {theme === "dark" ? (
                <Sun className="size-4 ml-2" />
            ) : (
                <Moon className="size-4 ml-2" />
            )}
            {theme === "dark" ? "الوضع المضيء" : "الوضع الليلي"}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="dark:bg-slate-800" />
        <DropdownMenuItem 
          onClick={onSignOut}
          className="h-10 cursor-pointer text-red-600 focus:text-red-700 dark:focus:bg-red-950/20"
        >
          <LogOut className="size-4 ml-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
