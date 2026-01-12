
export async function renderNewsletterEmail(content: string): Promise<string> {
    const { renderToStaticMarkup } = await import('react-dom/server');
    const { default: ReactMarkdown } = await import('react-markdown');
    const { default: remarkGfm } = await import('remark-gfm');
    const React = (await import('react')).default;

    const htmlContent = renderToStaticMarkup(
        React.createElement(ReactMarkdown, { remarkPlugins: [remarkGfm] }, content)
    );

    return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        ${htmlContent}
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
            Sent via AI Newsletter Generator
        </p>
    </body>
    </html>
    `;
}
