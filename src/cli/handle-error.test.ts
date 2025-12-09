import { beforeEach, describe, expect, it, vi } from "vitest";

import { handleError } from "./handle-error";

describe("handleError", () => {
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("logs error message when error is an Error instance", () => {
    const error = new Error("Test error message");
    handleError(error);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Test error message");
  });

  it("logs 'Error' when error is not an Error instance", () => {
    handleError("string error");
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error");
  });
});
