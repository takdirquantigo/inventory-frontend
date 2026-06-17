import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InputField({
    label,
    id,
    type = "text",
    placeholder,
    register,
    error,
    validation = {},
    skipDefaultValidation = false,
    textarea = false,
    rows = 4,
    className = "",
}) {
    let defaultValidation = {};

    if (!skipDefaultValidation) {
        if (type === "email") {
            defaultValidation = {
                pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                },
            };
        } else if (type === "text") {
            defaultValidation = {
                minLength: {
                    value: 3,
                    message: "Must be at least 3 characters",
                },
                maxLength: {
                    value: 100,
                    message: "Must be at most 100 characters",
                }
            };
        }
        //  else if (type === "number") {
        //     defaultValidation = {
        //         pattern: {
        //             value: /^[0-9]+$/,
        //             message: "Only numbers are allowed",
        //         },
        //         minLength: {
        //             value: 11,
        //             message: "Must be at least 11 characters",
        //         },
        //         maxLength: {
        //             value: 11,
        //             message: "Must be at most 11 characters",
        //         },
        //     };
        // }
    }

    const mergedValidation = { ...defaultValidation, ...validation };

    return (
        <div className="grid w-full items-center gap-3">
            <Label htmlFor={id}>
                {label} {validation.required && <span className="text-red-500">*</span>}
            </Label>

            <div>

                {textarea ? (
                    <textarea
                        id={id}
                        placeholder={placeholder}
                        rows={rows}
                        className={`border rounded-md px-3 py-2 text-sm ${className}`}
                        {...register(id, mergedValidation)}
                    />
                ) : (
                    <Input
                        id={id}
                        type={type}
                        placeholder={placeholder}
                        className={`border rounded-md px-3 py-2 text-sm ${className}`}
                        {...register(id, mergedValidation)}
                        onWheel={(e) => {
                            if (type === 'number') {
                                e.currentTarget.blur();
                            }
                        }}
                    />
                )}
                {error && <p className="text-sm text-red-500">{error.message}</p>}
            </div>


        </div>
    );
}