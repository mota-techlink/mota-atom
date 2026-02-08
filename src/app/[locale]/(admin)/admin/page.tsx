import { createClient } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { deleteUser } from "./actions"; // 引入刚才写的 action
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
export const runtime = 'edge';
export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
    
  // 获取所有用户 Profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Overview</h2>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Language</TableHead>
                <TableHead className="text-right">Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles?.map((profile) => (    
                <TableRow key={profile.id}>                                      
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback>{profile.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{profile.full_name || "No Name"}</span>
                      <span className="text-xs text-muted-foreground">{profile.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {profile.role === 'admin' ? (
                      <Badge variant="destructive" className="text-xs">Admin</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">User</Badge>
                    )}
                  </TableCell>
                  <TableCell>{profile.language || 'en'}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {new Date(profile.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                        {profile.id !== user?.id && (
                        <form action={async () => {
                            "use server";
                            await deleteUser(profile.id);
                        }}>
                            <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </form>
                        )}
                    </TableCell>  
                </TableRow>
              ))}
              
              {(!profiles || profiles.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}