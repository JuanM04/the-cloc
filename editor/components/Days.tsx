import { Card, Select } from "@geist-ui/react";
import { Day } from "utils/types";
import { DAYS } from "utils/consts";

const Days = ({
  days,
  setDays,
  disabled = false,
}: {
  days: Day[];
  setDays(days: Day[]): any;
  disabled?: boolean;
}) => (
  <Card>
    <h4>Days</h4>
    <Select
      placeholder="Days"
      multiple
      style={{ minWidth: "100%" }}
      initialValue={days}
      onChange={setDays}
      disabled={disabled}
    >
      {DAYS.map((d) => (
        <Select.Option key={d} value={d}>
          {d}
        </Select.Option>
      ))}
    </Select>
  </Card>
);

export default Days;
