<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Guest limits live in src/lib/reservation-rules.ts and must also be enforced server-side and by a DB check constraint — frontend checks alone can be bypassed.
- Owner confirm/decline links must carry a server-verified signed token and need a click on /reservation-action — stops email scanners auto-triggering actions.
- Weddings live on a dedicated /weddings page linked from the home page and header, with ceremony capacity data in src/lib/weddings.ts — keeps the wedding content shareable and capacities testable.
