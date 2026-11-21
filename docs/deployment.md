# Deployment runbook

**State: not deployed.** This runbook does not claim an AWS account, credentials, resources, GitHub push, or live URL. Deployment requires the account owner's explicit approval; SAM creates chargeable, account resources.

## Current service region / pricing gates

Suggested AWS region is `ap-south-1` (Mumbai). Verify Cognito, API Gateway HTTP API, Lambda, DynamoDB, CloudFormation and Amplify Hosting are offered for the account and exact region at deploy time. The AWS Free Tier changes over time and differs by account age / plan; inspect AWS Free Tier and every service's regional pricing page immediately before deployment. This repo uses DynamoDB on-demand, and its charges may exceed any provisioned-capacity free allowance. Amplify build minutes, data transfer, API request/data out, Lambda, Cognito, DynamoDB storage/requests, CloudWatch logs and deployment artifact storage may bill. Set a billing alert; it is not a hard cap.

Review: [Free Tier](https://aws.amazon.com/free/), [API Gateway](https://aws.amazon.com/api-gateway/pricing/), [DynamoDB](https://aws.amazon.com/dynamodb/pricing/), [Lambda](https://aws.amazon.com/lambda/pricing/), [Cognito](https://aws.amazon.com/cognito/pricing/), [Amplify](https://aws.amazon.com/amplify/pricing/).

## Deploy

1. From repo root: `npm ci`, `npm run build`, `npm test`, `npm run lint`.
2. Install AWS CLI v2 + AWS SAM CLI. Use an account-controlled IAM profile (never a root access key) and run `aws sts get-caller-identity --profile <profile>`. Confirm caller, account, region and budget.
3. Create Amplify Hosting app/branch through the AWS console by connecting the Git repository. Configure SPA fallback `/index.html` -> 200. Build: `npm ci && npm run build --workspace frontend`; artifact: `frontend/dist`. Check the current Hosting price and the resources/access Amplify requests.
4. Set frontend origin to the Amplify HTTPS domain. Deploy SAM backend with `AllowedOrigin` equal to that exact origin. From repo root:

```bash
sam validate --lint --template-file infrastructure/template.yaml
sam build --template-file infrastructure/template.yaml
sam deploy --guided --template-file .aws-sam/build/template.yaml \
  --stack-name campusconnect-shipit-2026 --region ap-south-1 \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides AllowedOrigin=https://<amplify-hostname>
```

5. Examine the change set: expected Cognito pool/client/admin group, HTTP API, Lambda + execution role/logs, seven DynamoDB tables (PAY_PER_REQUEST). No VPC, NAT Gateway, EC2, bucket, SNS or database cluster should appear. Stop if there are extra resources or charges you did not authorize.
6. Copy outputs to Amplify build environment: `VITE_API_URL` (include trailing `/v1` from output), `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_CLIENT_ID`, `VITE_COGNITO_REGION`. These are public client configuration values, not secrets. Rebuild/redeploy frontend.
7. Use registration / email verification. In Cognito console, add only a verified operator to the `admins` group. Confirm student cannot perform admin operations by calling API, not just hiding UI.
8. Optional seed records, using AWS SDK caller credentials and names derived from stack outputs (see README). Use only the fictional fixture script.
9. Test on public URL using the production checklist in `testing-report.md`. Record URL only after verifying HTTPS, frontend origin, real Cognito authentication, DynamoDB persistence, admin authorization and seat race behavior.

## Cost / teardown

The optional `infrastructure/budget-alert.yaml` sets an example budget threshold and asks for an email. Configure your own limit and check the correct AWS billing region/account. Alerts can arrive late and do not stop resource use.

To remove the demo: export required data, then `sam delete --stack-name campusconnect-shipit-2026 --region ap-south-1`. This is destructive: the stack currently does not enable DynamoDB deletion protection. Remove Amplify app/branch and any deployment artifact bucket objects or SAM-managed bucket you created. Check for retained resources and Billing/Cost Explorer. If keeping data, do not delete the stack until a backup/retention plan is approved.
