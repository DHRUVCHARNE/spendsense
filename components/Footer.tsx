import { appInfo } from "./config";

export default function Footer() {

    return(
      <footer className="border-t border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href={appInfo.social.x} className="hover:text-foreground transition-colors">X</a></li>
                <li><a href={appInfo.social.linkedin} className="hover:text-foreground transition-colors">LinkedIn</a></li>
                <li><a href={appInfo.social.github} className="hover:text-foreground transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
           <div className="text-xs text-muted-foreground text-center md:text-left">
              <p>
                © {appInfo.currentYear} {appInfo.title} by{" "}
                <span className="font-semibold text-foreground">{appInfo.author}</span>. All rights reserved.
              </p>
            </div>
        </div>
      </footer>
    );
}