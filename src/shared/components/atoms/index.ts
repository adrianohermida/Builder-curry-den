/**
 * Atoms - Basic UI Building Blocks
 *
 * Complete index of all atomic components following the design system.
 * These are the fundamental building blocks used throughout the application.
 */

// Form elements
export { Button } from "./Button";
export { Input } from "./Input";
export { Label } from "./Label";
export { Textarea } from "./Textarea";
export { Checkbox } from "./Checkbox";
export { RadioButton } from "./RadioButton";
export { Select } from "./Select";
export { Switch } from "./Switch";

// Typography
export { Heading } from "./Heading";
export { Text } from "./Text";
export { Link } from "./Link";

// Media
export { Avatar } from "./Avatar";
export { Image } from "./Image";
export { Icon } from "./Icon";

// Feedback
export { Badge } from "./Badge";
export { Spinner } from "./Spinner";
export { ProgressBar } from "./ProgressBar";

// Layout
export { Separator } from "./Separator";
export { Divider } from "./Divider";
export { Container } from "./Container";
export { Box } from "./Box";

// Interactive
export { Tooltip } from "./Tooltip";
export { Tag } from "./Tag";

// Re-export existing UI components for backward compatibility
export { Input as UIInput } from "@/components/ui/input";
export { Button as UIButton } from "@/components/ui/button";
export { Badge as UIBadge } from "@/components/ui/badge";
