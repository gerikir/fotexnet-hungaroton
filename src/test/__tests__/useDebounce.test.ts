import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks";

describe("useDebounce", () => {
    it("should return initial value immediately", () => {
        const { result } = renderHook(() => useDebounce("initial", 100));
        expect(result.current).toBe("initial");
    });

    it("should debounce value changes", async () => {
        const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
            initialProps: { value: "initial", delay: 100 },
        });

        expect(result.current).toBe("initial");

        rerender({ value: "updated", delay: 100 });
        expect(result.current).toBe("initial");

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 150));
        });

        expect(result.current).toBe("updated");
    });

    it("should clear timeout on unmount", () => {
        const { unmount } = renderHook(() => useDebounce("test", 100));
        unmount();
    });
});
