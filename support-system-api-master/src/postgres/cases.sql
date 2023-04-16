CREATE TABLE cases (
  case_id uuid not null PRIMARY KEY,
  description TEXT,
  status VARCHAR(255),
  customer_id uuid REFERENCES customers(customer_id),
  agent_id uuid REFERENCES agent(agent_id),
  product_id uuid references product(product_id)
);