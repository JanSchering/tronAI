import * as React from "react";
import Form from "react-bootstrap/Form";

export const AISetup: React.FC = (): React.ReactElement => {
  return (
    <Form>
      <Form.Label>Name</Form.Label>
      <Form.Control size="xs" type="text" placeholder="Large text" />
    </Form>
  );
};
