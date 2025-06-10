// Stripe Integration Service for Lawdesk CRM
// Handles payments, subscriptions, and billing automation

export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  type: "petition" | "flipbook" | "template" | "consultation" | "contract";
  price: number;
  currency: string;
  recurring?: {
    interval: "month" | "year";
    interval_count: number;
  };
  metadata: {
    module: string;
    content_id: string;
    category: string;
  };
}

export interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  metadata: {
    lawdesk_user_id: string;
    subscription_tier: string;
  };
}

export interface StripePayment {
  id: string;
  customer_id: string;
  product_id: string;
  amount: number;
  status: "pending" | "succeeded" | "failed" | "canceled";
  payment_method: string;
  created_at: string;
  metadata: {
    content_type: string;
    module: string;
    user_id: string;
  };
}

export interface StripeSubscription {
  id: string;
  customer_id: string;
  status: "active" | "past_due" | "canceled" | "unpaid";
  current_period_start: string;
  current_period_end: string;
  plan_id: string;
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
}

export interface WebhookEvent {
  type: string;
  data: {
    object: any;
  };
  created: number;
}

class StripeService {
  private static instance: StripeService;
  private apiKey: string;
  private webhookSecret: string;
  private baseUrl: string;

  private constructor() {
    // Import env utility dynamically to avoid circular dependencies
    import("../lib/env").then(({ env }) => {
      this.apiKey = env.STRIPE_SECRET_KEY || "";
      this.webhookSecret = env.STRIPE_WEBHOOK_SECRET || "";
    });
    this.baseUrl = "https://api.stripe.com/v1";
  }

  static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  // Product Management
  async createProduct(
    product: Omit<StripeProduct, "id">,
  ): Promise<StripeProduct> {
    try {
      // Simulate Stripe API call
      const newProduct: StripeProduct = {
        id: `prod_${Date.now()}`,
        ...product,
      };

      console.log("Creating Stripe product:", newProduct);
      return newProduct;
    } catch (error) {
      console.error("Error creating Stripe product:", error);
      throw error;
    }
  }

  async updateProduct(
    productId: string,
    updates: Partial<StripeProduct>,
  ): Promise<StripeProduct> {
    try {
      // Simulate Stripe API call
      console.log("Updating Stripe product:", productId, updates);

      // Return updated product (mock)
      return {
        id: productId,
        name: updates.name || "Updated Product",
        description: updates.description || "",
        type: updates.type || "petition",
        price: updates.price || 0,
        currency: updates.currency || "BRL",
        metadata: updates.metadata || {
          module: "",
          content_id: "",
          category: "",
        },
      };
    } catch (error) {
      console.error("Error updating Stripe product:", error);
      throw error;
    }
  }

  async deleteProduct(productId: string): Promise<boolean> {
    try {
      console.log("Deleting Stripe product:", productId);
      return true;
    } catch (error) {
      console.error("Error deleting Stripe product:", error);
      throw error;
    }
  }

  // Customer Management
  async createCustomer(
    customer: Omit<StripeCustomer, "id">,
  ): Promise<StripeCustomer> {
    try {
      const newCustomer: StripeCustomer = {
        id: `cus_${Date.now()}`,
        ...customer,
      };

      console.log("Creating Stripe customer:", newCustomer);
      return newCustomer;
    } catch (error) {
      console.error("Error creating Stripe customer:", error);
      throw error;
    }
  }

  async getCustomer(customerId: string): Promise<StripeCustomer | null> {
    try {
      // Simulate API call
      console.log("Fetching Stripe customer:", customerId);

      // Mock customer data
      return {
        id: customerId,
        email: "cliente@example.com",
        name: "Cliente Exemplo",
        metadata: {
          lawdesk_user_id: "user_123",
          subscription_tier: "premium",
        },
      };
    } catch (error) {
      console.error("Error fetching Stripe customer:", error);
      return null;
    }
  }

  // Payment Processing
  async createPaymentIntent(
    amount: number,
    currency: string = "brl",
    metadata: Record<string, string> = {},
  ): Promise<{ client_secret: string; payment_intent_id: string }> {
    try {
      // Simulate Stripe Payment Intent creation
      const paymentIntent = {
        client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        payment_intent_id: `pi_${Date.now()}`,
      };

      console.log("Creating payment intent:", { amount, currency, metadata });
      return paymentIntent;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw error;
    }
  }

  async createCheckoutSession(
    productId: string,
    customerId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<{ url: string; session_id: string }> {
    try {
      // Simulate Stripe Checkout Session creation
      const session = {
        url: `https://checkout.stripe.com/pay/cs_test_${Math.random().toString(36).substr(2, 9)}`,
        session_id: `cs_${Date.now()}`,
      };

      console.log("Creating checkout session:", {
        productId,
        customerId,
        successUrl,
        cancelUrl,
      });

      return session;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
  }

  // Subscription Management
  async createSubscription(
    customerId: string,
    productId: string,
    priceId: string,
  ): Promise<StripeSubscription> {
    try {
      const subscription: StripeSubscription = {
        id: `sub_${Date.now()}`,
        customer_id: customerId,
        status: "active",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        plan_id: priceId,
        items: [
          {
            product_id: productId,
            quantity: 1,
            price: 29.9,
          },
        ],
      };

      console.log("Creating subscription:", subscription);
      return subscription;
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      console.log("Canceling subscription:", subscriptionId);
      return true;
    } catch (error) {
      console.error("Error canceling subscription:", error);
      throw error;
    }
  }

  // Billing Portal
  async createBillingPortalSession(
    customerId: string,
    returnUrl: string,
  ): Promise<{ url: string }> {
    try {
      const session = {
        url: `https://billing.stripe.com/session/${Math.random().toString(36).substr(2, 9)}?return_url=${encodeURIComponent(returnUrl)}`,
      };

      console.log("Creating billing portal session for customer:", customerId);
      return session;
    } catch (error) {
      console.error("Error creating billing portal session:", error);
      throw error;
    }
  }

  // Webhook Handling
  async handleWebhook(
    payload: string,
    signature: string,
  ): Promise<WebhookEvent | null> {
    try {
      // Simulate webhook signature verification
      console.log("Processing webhook with signature:", signature);

      // Parse webhook event
      const event: WebhookEvent = JSON.parse(payload);

      // Handle different event types
      await this.processWebhookEvent(event);

      return event;
    } catch (error) {
      console.error("Error handling webhook:", error);
      return null;
    }
  }

  private async processWebhookEvent(event: WebhookEvent): Promise<void> {
    switch (event.type) {
      case "payment_intent.succeeded":
        await this.handlePaymentSuccess(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await this.handlePaymentFailure(event.data.object);
        break;

      case "customer.subscription.created":
        await this.handleSubscriptionCreated(event.data.object);
        break;

      case "customer.subscription.updated":
        await this.handleSubscriptionUpdated(event.data.object);
        break;

      case "customer.subscription.deleted":
        await this.handleSubscriptionCanceled(event.data.object);
        break;

      case "invoice.payment_succeeded":
        await this.handleInvoicePaid(event.data.object);
        break;

      case "invoice.payment_failed":
        await this.handleInvoiceFailed(event.data.object);
        break;

      default:
        console.log("Unhandled webhook event type:", event.type);
    }
  }

  // Event Handlers
  private async handlePaymentSuccess(paymentIntent: any): Promise<void> {
    console.log("Payment succeeded:", paymentIntent.id);

    // Unlock content for user
    const metadata = paymentIntent.metadata;
    if (metadata.content_type && metadata.user_id) {
      await this.unlockContentForUser(
        metadata.user_id,
        metadata.content_type,
        metadata.content_id,
      );
    }

    // Send confirmation email
    await this.sendPaymentConfirmationEmail(paymentIntent);
  }

  private async handlePaymentFailure(paymentIntent: any): Promise<void> {
    console.log("Payment failed:", paymentIntent.id);

    // Send failure notification
    await this.sendPaymentFailureEmail(paymentIntent);
  }

  private async handleSubscriptionCreated(subscription: any): Promise<void> {
    console.log("Subscription created:", subscription.id);

    // Update user subscription status
    const customerId = subscription.customer;
    await this.updateUserSubscriptionStatus(customerId, "active");
  }

  private async handleSubscriptionUpdated(subscription: any): Promise<void> {
    console.log("Subscription updated:", subscription.id);

    // Update user subscription status
    const customerId = subscription.customer;
    await this.updateUserSubscriptionStatus(customerId, subscription.status);
  }

  private async handleSubscriptionCanceled(subscription: any): Promise<void> {
    console.log("Subscription canceled:", subscription.id);

    // Update user subscription status
    const customerId = subscription.customer;
    await this.updateUserSubscriptionStatus(customerId, "canceled");
  }

  private async handleInvoicePaid(invoice: any): Promise<void> {
    console.log("Invoice paid:", invoice.id);

    // Send receipt
    await this.sendReceiptEmail(invoice);
  }

  private async handleInvoiceFailed(invoice: any): Promise<void> {
    console.log("Invoice payment failed:", invoice.id);

    // Send dunning email
    await this.sendDunningEmail(invoice);
  }

  // Helper Methods
  private async unlockContentForUser(
    userId: string,
    contentType: string,
    contentId: string,
  ): Promise<void> {
    console.log("Unlocking content for user:", {
      userId,
      contentType,
      contentId,
    });

    // Implementation would update user permissions in database
    // This is where you'd integrate with your user management system
  }

  private async updateUserSubscriptionStatus(
    customerId: string,
    status: string,
  ): Promise<void> {
    console.log("Updating subscription status:", { customerId, status });

    // Implementation would update user subscription in database
  }

  private async sendPaymentConfirmationEmail(
    paymentIntent: any,
  ): Promise<void> {
    console.log("Sending payment confirmation email for:", paymentIntent.id);

    // Implementation would send email via your email service
  }

  private async sendPaymentFailureEmail(paymentIntent: any): Promise<void> {
    console.log("Sending payment failure email for:", paymentIntent.id);

    // Implementation would send failure notification
  }

  private async sendReceiptEmail(invoice: any): Promise<void> {
    console.log("Sending receipt email for invoice:", invoice.id);

    // Implementation would send receipt
  }

  private async sendDunningEmail(invoice: any): Promise<void> {
    console.log("Sending dunning email for invoice:", invoice.id);

    // Implementation would send dunning notification
  }

  // Analytics and Reporting
  async getPaymentAnalytics(
    startDate: string,
    endDate: string,
  ): Promise<{
    total_revenue: number;
    total_transactions: number;
    success_rate: number;
    top_products: Array<{ product_id: string; revenue: number; count: number }>;
  }> {
    // Mock analytics data
    return {
      total_revenue: 127890.5,
      total_transactions: 542,
      success_rate: 94.2,
      top_products: [
        { product_id: "prod_petition_divorce", revenue: 45890.5, count: 89 },
        { product_id: "prod_template_contract", revenue: 32450.0, count: 156 },
        { product_id: "prod_consultation_legal", revenue: 28900.0, count: 23 },
      ],
    };
  }

  async getSubscriptionAnalytics(): Promise<{
    active_subscriptions: number;
    monthly_recurring_revenue: number;
    churn_rate: number;
    average_revenue_per_user: number;
  }> {
    // Mock subscription analytics
    return {
      active_subscriptions: 1247,
      monthly_recurring_revenue: 284790.5,
      churn_rate: 2.4,
      average_revenue_per_user: 228.5,
    };
  }
}

export const stripeService = StripeService.getInstance();
export default StripeService;
