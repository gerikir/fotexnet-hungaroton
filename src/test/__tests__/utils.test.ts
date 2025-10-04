import { cn } from "@/lib/utils";

describe("Utils", () => {
    describe("cn function", () => {
        it("should merge class names correctly", () => {
            expect(cn("class1", "class2")).toBe("class1 class2");
        });

        it("should handle conditional classes", () => {
            expect(cn("base", { conditional: true })).toBe("base conditional");
            expect(cn("base", { conditional: false })).toBe("base");
        });

        it("should handle undefined and null values", () => {
            expect(cn("base", undefined, null)).toBe("base");
        });

        it("should handle empty strings", () => {
            expect(cn("", "class1", "")).toBe("class1");
        });
    });
});
