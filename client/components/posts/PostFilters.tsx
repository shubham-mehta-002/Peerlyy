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

interface PostFiltersProps {
    filters: PostFiltersType;
    onFiltersChange: (filters: PostFiltersType) => void;
    userCollegeId?: string;
}

export const PostFilters = ({ filters, onFiltersChange, userCollegeId }: PostFiltersProps) => {
    const handleSortChange = (value: string) => {
        onFiltersChange({ ...filters, sort: value });
    };

    const handleVisibilityChange = (value: string) => {
        const { visibility, collegeId, ...rest } = filters;
        if (value === "global") {
            onFiltersChange({ ...rest, feedType: "global" });
        } else if (value === "college") {
            onFiltersChange({ ...rest, feedType: "college" });
        }
    };

    const getCurrentVisibility = () => {
        return filters.feedType || "global";
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Filter by Visibility */}
            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                    value={getCurrentVisibility()}
                    onValueChange={handleVisibilityChange}
                >
                    <SelectTrigger className="w-[160px] bg-background/50 border-border/30">
                        <SelectValue placeholder="Filter posts" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="global">
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                All Posts
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
                    value={filters.sort || "hot"}
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
