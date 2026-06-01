import emailjs from "@emailjs/browser";

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
};

export type EmailJSResponse = {
  status: number;
  text: string;
};

// Initialize EmailJS with your public key
const initEmailJS = () => {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (publicKey) {
    emailjs.init(publicKey);
  }
};

initEmailJS();

export const contactAPI = {
  send: async (data: ContactPayload): Promise<EmailJSResponse> => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    if (!serviceId || !templateId) {
      throw new Error("EmailJS configuration missing. Check environment variables.");
    }

    const response = await emailjs.send(serviceId, templateId, {
      to_email: "hello.kavaro@gmail.com",
      from_name: data.name,
      from_email: data.email,
      phone: data.phone || "Not provided",
      service: data.service || "Not specified",
      message: data.message,
      reply_to: data.email,
    });

    return response as EmailJSResponse;
  },
};
