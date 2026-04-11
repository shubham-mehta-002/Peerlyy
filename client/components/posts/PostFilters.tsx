"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PostFilters as PostFiltersType } from "@/types/posts.types";
import { Filter, ArrowUpDown, GraduationCap, Globe, Clock, TrendingUp, Calendar, Flame } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PostFiltersProps {
    userCollegeId?: string;
}

export const PostFilters = ({ userCollegeId }: PostFiltersProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const feedType = searchParams.get("feed") || "global";
    const sortBy = searchParams.get("sort") || "hot";

    const updateParams = (newParams: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        router.push(`/?${params.toString()}`);
    };

    const handleSortChange = (value: string) => {
        updateParams({ sort: value });
    };

    const handleVisibilityChange = (value: string) => {
        updateParams({ feed: value });
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Filter by Visibility */}
            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                    value={feedType}
                    onValueChange={handleVisibilityChange}
                >
                    <SelectTrigger className="w-[160px] bg-background/50 border-border/30">
                        <SelectValue placeholder="Filter posts" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="global">
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Public Feed
                            </div>
                        </SelectItem>
                        <SelectItem value="college" disabled={!userCollegeId}>
                            <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4" />
                                My College
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select
                    value={sortBy}
                    onValueChange={handleSortChange}
                >
                    <SelectTrigger className="w-[160px] bg-background/50 border-border/30">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="hot">
                            <div className="flex items-center gap-2">
                                <Flame className="h-4 w-4 text-orange-500" />
                                Hot
                            </div>
                        </SelectItem>
                        <SelectItem value="latest">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Latest
                            </div>
                        </SelectItem>
                        <SelectItem value="oldest">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Oldest
                            </div>
                        </SelectItem>
                        <SelectItem value="most_upvoted">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Most Upvoted
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
