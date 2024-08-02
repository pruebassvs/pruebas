FROM ghcr.io/railwayapp/nixpacks:ubuntu-1716249803

WORKDIR /app/

COPY .nixpacks/nixpkgs-bf446f08bff6814b569265bef8374cfdd3d8f0e0.nix .nixpacks/nixpkgs-bf446f08bff6814b569265bef8374cfdd3d8f0e0.nix
RUN nix-env -if .nixpacks/nixpkgs-bf446f08bff6814b569265bef8374cfdd3d8f0e0.nix && nix-collect-garbage -d

COPY . /app/

RUN --mount=type=cache,id=s/782dd49c-dda7-41b2-8e50-ca0bf6e6880b-/root/cache/pip,target=/root/.cache/pip python -m venv --copies /opt/venv && . /opt/venv/bin/activate && pip install -r requirements.txt

CMD ["gunicorn", "Full_Online.Full_Online.wsgi", "--log-file", "-"]
